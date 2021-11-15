const Tithes = require('../models/tithes');

const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

function getMonthName(month) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month];
}

exports.getTithes = catchAsync(async (req, res, next) => {
  let tithesCount = await Tithes.countDocuments();
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  let monthName = 'All';
  if (req.query.month <= 11) {
    monthName = getMonthName(Number(req.query.month));
    let countTithes = await Tithes.aggregate([
      {
        $match: { month: { $eq: Number(req.query.month) } },
      },
      {
        $group: {
          _id: null,
          sumNum: { $sum: 1 },
        },
      },
    ]);
    if (countTithes.length > 0) {
      tithesCount = countTithes[0].sumNum;
    } else {
      tithesCount = 0;
    }
  }

  const features = new APIFeatures(Tithes.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tithes = await features.query;

  res.status(200).render('tithes', {
    title: 'Tithes',
    tithes,
    tithesCount,
    monthName,
    page,
  });
});

exports.readTithes = catchAsync(async (req, res, next) => {
  const tithe = await Tithes.findOne({
    _id: req.params.id,
  });

  res.render('readTithes', {
    tithe,
  });
});

exports.loginPage = (req, res) => {
  res.render('login');
};
exports.tithesPage = (req, res) => {
  res.render('tithes');
};
exports.adminPage = (req, res) => {
  res.render('admin');
};
exports.aboutPage = (req, res) => {
  res.render('about');
};

exports.modifyTithesPage = catchAsync(async (req, res) => {
  let tithesCount = await Tithes.countDocuments();
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  const features = new APIFeatures(Tithes.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tithes = await features.query;
  res.render('modifyTithes', {
    tithes,
    tithesCount,
    page,
  });
});
exports.modifyTithes = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tithes.find(), {
    _id: req.params.id,
  }).filter();

  const tithe = await features.query;
  res.render('tithesUpdate', {
    tithe,
  });
});
