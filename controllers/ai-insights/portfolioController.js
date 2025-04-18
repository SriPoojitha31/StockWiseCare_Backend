export const optimizePortfolio = (req, res) => {
  const { portfolio } = req.body
  // Just return portfolio with slight tweaks as a demo
  const optimized = portfolio.map(stock => ({
    ...stock,
    suggestedAllocation: Math.min(stock.allocation + Math.random() * 5, 100).toFixed(2)
  }))
  res.json({ optimizedPortfolio: optimized })
}