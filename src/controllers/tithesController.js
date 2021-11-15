const Tithes = require('../models/tithes');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createTither = catchAsync(async (req, res, next) => {
  //Making a proper object from the body
  console.log(req.body);
  //destructuring
  const { tither, phone, amount } = req.body;
  //1. check if all details exist
  if (!tither || !phone || !amount) {
    return next(new AppError('Please provide all details!!', 400));
  }
  console.log(req.body);
  const tithe = new Tithes({
    ...req.body,
    owner: req.user._id,
  });
  await tithe.save();
  res.status(201).json({
    status: 'success',
    data: {
      tithe,
    },
  });
  // next();
});

exports.searchTithe = catchAsync(async (req, res, next) => {
  const _id = req.params.id;
  const tithe = await Tithes.findOne({
    _id,
    owner: req.user._id,
  });
  if (!tithe) {
    return next(new AppError('There is no such sermon', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tithe,
  });
  next();
});

exports.updateTithe = catchAsync(async (req, res, next) => {
  //2. Filtered out unwanted field names not allowed to be updated
  console.log(req.body);
  if (!req.body.tither || !req.body.phone || !req.body.amount) {
    return next(new AppError('Please provide all details!!', 400));
  }
  const filteredBody = filterObj(req.body, 'tither', 'phone', 'amount');

  //3. Update sermon document
  const tithe = await Tithes.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!tithe) {
    return next(new AppError("Not Created by you! Can't update!!"));
  }

  res.status(200).json({
    status: 'success',
    data: tithe,
  });
});

exports.removeTithe = catchAsync(async (req, res, next) => {
  const tithe = await Tithes.findOneAndDelete({
    _id: req.params.id,
    // owner: req.user._id,
  });
  if (!tithe) {
    return next(new AppError('Not created by you! Not deleted!!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: tithe,
  });
});

exports.getTithes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tithes.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let countTithes;
  if (req.query.month <= 11) {
    countSermon = await Tithes.aggregate([
      {
        $match: { month: { $eq: Number(req.query.month) } },
      },
      {
        $group: {
          _id: 'Monthly Tithes',
          sumNum: { $sum: 1 },
        },
      },
    ]);
    if (countTithes.length > 0) {
      console.log(countTithes[0].sumNum);
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'No Tithes for this month',
      });
    }
  }

  const sermon = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      countTithes,
      tithes,
    },
  });
});
