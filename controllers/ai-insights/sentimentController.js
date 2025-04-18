export const analyzeSentiment = (req, res) => {
    const { stocks } = req.body
    // Placeholder logic
    const result = stocks.map(stock => ({
      stock,
      sentiment: Math.random() > 0.5 ? 'positive' : 'negative'
    }))
    res.json({ analysis: result })
  }