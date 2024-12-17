import ServiceTypeModel from "../models/Brand.js";

class ServiceTypeController {
  //create service
  static createServiceType = async (req, res, next) => {
    try {
      const { name, active } = req.body;
      if (!name) {
        return res
          .status(412)
          .json({ message: `Name is required to create service type` });
      }

      const serviceType = await ServiceTypeModel.findOne({ name });
      if (serviceType) {
        return res.status(412).json({
          message: `Service Type with name ${name} already exists`,
        });
      }
      const doc = new ServiceTypeModel({
        name,
        active,
      });
      const data = await doc.save();
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  //getAllServicesType

  static getServiceType = async ({ query }, res, next) => {
    try {
      const defaultConfig = {
        limit: 50,
        sort: 1,
        sortBy: "createdAt",
        page: 1,
        name: "",
        active: "all",
      };
      const { page, sort, sortBy, limit, name, active } = {
        ...defaultConfig,
        ...query,
      };
      const mongoQuery = {
        name: { $regex: name, $options: "i" },

        ...(active !== "all"
          ? active === "true"
            ? { active: true }
            : { active: false }
          : {}),
      };

      const [serviceTypes, total] = await Promise.all([
        ServiceTypeModel.find(mongoQuery)
          .sort({ [sortBy]: sort })
          .skip(
            (parseInt(page) <= 0 ? 1 : parseInt(page) - 1) * parseInt(limit)
          )
          .limit(parseInt(limit)),
        ServiceTypeModel.countDocuments(mongoQuery),
      ]);

      return res.json({
        serviceTypes,
        limit: parseInt(limit),
        currentPage: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  //deleteServicesType
  static deleteServiceType = async (req, res, next) => {
    try {
      const { id } = req.params;
      const type = await ServiceTypeModel.findById(id);
      if (!type)
        return res.status(404).json({ message: "Service Type not found" });
      await ServiceTypeModel.findOneAndDelete(id);
      res.status(200).json({
        message: "Service Type deleted successfully",
      });
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static updateServiceType = async (req, res, next) => {
    try {
      const { id } = req.params;
      const type = await ServiceTypeModel.findById(id);
      if (!type) {
        throw Error("Type not exits");
      }
      const data = await ServiceTypeModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };

  static updateStatus = async ({ params, body }, res, next) => {
    try {
      const { id } = params;
      const { active } = body;
      const type = await ServiceTypeModel.findById(id);
      if (!type) {
        return res.status(404).json({ message: "Service Type not found" });
      }
      const data = await ServiceTypeModel.findByIdAndUpdate(
        id,
        { active },
        {
          new: true,
        }
      );
      res.status(200).json(data);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
  static getOne = async (req, res, next) => {
    try {
      const { id } = req.params;

      const service = await ServiceTypeModel.findById({ _id: id });
      if (!service) {
        return res.status(404).json({ message: "Service Type not found" });
      }
      res.status(200).json(service);
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default ServiceTypeController;
