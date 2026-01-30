app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)

app.get('/health', (req, res) => {
  res.json({ message: 'API Working' })
})


