process.on("unhandledRejection", (error) => {
  console.error(error)
  process.exit(1)
})
