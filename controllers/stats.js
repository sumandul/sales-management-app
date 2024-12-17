class StatsController {
  static getSales = async ({ query }, res, next) => {
    try {
      const {
        status = "all",
        paymentMethod = "all",
        fromDate = null,
        toDate = null,
      } = query;

      // Ensure date formats are valid
      const fromDateParsed = fromDate
        ? new Date(fromDate + "T00:00:00.000Z")
        : null;
      const toDateParsed = toDate ? new Date(toDate + "T23:59:59.999Z") : null;

      if (!fromDateParsed || !toDateParsed) {
        return res.status(400).json({ error: "Invalid date range." });
      }

      // Pipeline to aggregate sales data
      const pipeline = [
        {
          $set: {
            customerObjId: { $toObjectId: "$customer" },
            repairObjId: { $toObjectId: "$repair" },
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customerObjId",
            foreignField: "_id",
            as: "customers",
          },
        },
        {
          $lookup: {
            from: "repairs",
            localField: "repairObjId",
            foreignField: "_id",
            as: "repairs",
          },
        },
        { $unwind: "$repairs" },
        {
          $lookup: {
            from: "servicetypes",
            localField: "repairs.serviceTypeId",
            foreignField: "_id",
            as: "servicetypes",
          },
        },
        { $unwind: "$servicetypes" },
        {
          $set: {
            customer: { $first: "$customers" },
            repair: "$repairs",
            servicetype: "$servicetypes",
          },
        },
        {
          $match: {
            "repair.status": { $in: ["completed", "pickedup"] },
            ...(status !== "all" && { status }),
            ...(fromDateParsed && { createdAt: { $gte: fromDateParsed } }),
            ...(fromDateParsed &&
              toDateParsed && {
                createdAt: { $gte: fromDateParsed, $lte: toDateParsed },
              }),
            ...(paymentMethod !== "all" && { paymentMethod }),
          },
        },
        {
          $project: {
            totalIssuesPrice: {
              $sum: {
                $map: {
                  input: "$issuesWithPrice",
                  as: "issue",
                  in: "$$issue.price",
                },
              },
            },
            discount: 1,
            chargePaid: 1,
            expectedServiceCharge: 1,
            createdAt: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
        },
        {
          $group: {
            _id: "$createdAt",
            totalDiscount: { $sum: "$discount" },

            totalExpectedServiceCharge: { $sum: "$expectedServiceCharge" },
            totalIssuesPrice: { $sum: "$totalIssuesPrice" },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            totalDiscount: 1,
            totalExpectedServiceCharge: 1,
            totalIssuesPrice: 1,
          },
        },
        // Sort by date
        { $sort: { date: 1 } },

        // Aggregate totals for the entire date range
        {
          $group: {
            _id: null,
            totalDiscount: { $sum: "$totalDiscount" },

            totalExpectedServiceCharge: { $sum: "$totalExpectedServiceCharge" },
            totalIssuesPrice: { $sum: "$totalIssuesPrice" },
            dailyData: { $push: "$$ROOT" }, // Push the daily data for the final result
          },
        },
        {
          $project: {
            dailyData: 1,
            totalDiscount: 1,

            totalExpectedServiceCharge: 1,
            totalIssuesPrice: 1,
          },
        },
      ];

      const aggregatedData = await ReceiptModel.aggregate(pipeline);

      // Generate date range
      const generateDateRange = (startDate, endDate) => {
        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          dateArray.push(currentDate.toISOString().split("T")[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
      };

      const dateRange = generateDateRange(fromDateParsed, toDateParsed);

      // Map aggregated data to a date key
      const aggregatedDataMap =
        aggregatedData[0]?.dailyData.reduce((acc, item) => {
          acc[item.date] = item;
          return acc;
        }, {}) || {};

      // Fill missing dates with zero values
      const result = dateRange.map((date) => ({
        date,
        totalDiscount: aggregatedDataMap[date]?.totalDiscount || 0,

        totalExpectedServiceCharge:
          aggregatedDataMap[date]?.totalExpectedServiceCharge || 0,
        totalIssuesPrice: aggregatedDataMap[date]?.totalIssuesPrice || 0,
      }));

      // Total sum
      const totalSum = {
        totalDiscount: aggregatedData[0]?.totalDiscount || 0,

        totalExpectedServiceCharge:
          aggregatedData[0]?.totalExpectedServiceCharge || 0,
        totalIssuesPrice: aggregatedData[0]?.totalIssuesPrice || 0,
      };

      return res.json({
        result,
        totalSum,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      next(error);
    }
  };
}

export default StatsController;
