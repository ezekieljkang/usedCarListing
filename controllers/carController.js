const Car = require('../models/Car');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");


exports.index = (req, res) => {
  res.render('index', { title: 'Home' });
};

// Display list of all cars.
exports.car_list = asyncHandler(async (req, res, next) => {
  let page = parseInt(req.query.page, 10) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  if (page < 1) {
    page = 1;
  }

  try {
    const [allCars, totalCars] = await Promise.all([
      Car.find({}, "year_produced manufacturer_name model_name price_usd")
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Car.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalCars / limit);

    res.render("car_list", {
      title: "Car List",
      cars: allCars,
      currentPage: page,
      totalPages: totalPages,
      body: 'car_list'
    });
  } catch (error) {
    console.error("Error retrieving cars:", error);
    next(error);
  }
});

// Display detail page for a specific car
exports.car_detail = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id).exec();
  if (car === null) {
    const err = new Error("Car not found");
    err.status = 404;
    return next(err);
  }
  res.render("car_detail", { title: "Car Detail", car: car });
});

// Display car create form on GET
exports.car_create_get = (req, res, next) => {
  res.render("car_form", { title: "Create Car" });
};

// Display car create on POST
exports.car_create_post = [
  body("manufacturer_name", "Manufacturer Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("model_name", "Model Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year_produced", "Year Produced must not be empty")
    .trim()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .escape(),
  body("odometer_value", "Odometer Value must not be empty")
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body("price_usd", "Price must not be empty")
    .trim()
    .isInt({ min: 0 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("car_form", {
        title: "Create Car",
        car: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const car = new Car({
        manufacturer_name: req.body.manufacturer_name,
        model_name: req.body.model_name,
        year_produced: req.body.year_produced,
        odometer_value: req.body.odometer_value,
        price_usd: req.body.price_usd,
        // Add more fields as needed
      });
      await car.save();
      res.redirect(`/catalog/cars/${car._id}`);
    }
  }),
];

// Display car delete form on GET.
exports.car_delete_get = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id).exec();
  if (!car) {
    res.redirect('/catalog/cars');
    return;
  }
  res.render("car_delete", { title: "Delete Car", car: car });
});

// Handle car delete on POST
exports.car_delete_post = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.carid).exec();
  if (!car) {
    res.redirect('/catalog/cars');
    return;
  }
  await Car.findByIdAndDelete(req.params.carid);
  res.redirect("/catalog/cars");
});

// Display car update form on GET
exports.car_update_get = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id).exec();
  if (!car) {
    const err = new Error("Car not found");
    err.status = 404;
    return next(err);
  }
  res.render("car_form", { title: "Update Car", car: car });
});

// Display car update form on POST
exports.car_update_post = [
  body("manufacturer_name", "Manufacturer Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("model_name", "Model Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year_produced", "Year Produced must not be empty")
    .trim()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .escape(),
  body("odometer_value", "Odometer Value must not be empty")
    .trim()
    .isInt({ min: 0 })
    .escape(),
  body("price_usd", "Price must not be empty")
    .trim()
    .isInt({ min: 0 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("car_form", {
        title: "Update Car",
        car: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const car = {
        manufacturer_name: req.body.manufacturer_name,
        model_name: req.body.model_name,
        year_produced: req.body.year_produced,
        odometer_value: req.body.odometer_value,
        price_usd: req.body.price_usd,
        // Add more fields as needed
        _id: req.params.id,
      };
      await Car.findByIdAndUpdate(req.params.id, car, {});
      res.redirect(`/catalog/cars/${req.params.id}`);
    }
  }),
];

