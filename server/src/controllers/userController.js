export const getUser = (req, res, next) => {
  console.log("hello from get user");
  res.status(200).json({
    status: "success",
  });
};
