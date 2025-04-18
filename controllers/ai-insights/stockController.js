export const analyzeNews = (req, res) => {
    const { newsArticles } = req.body
    const results = newsArticles.map(article => ({
      title: article.title,
      impact: Math.random() > 0.5 ? 'high' : 'low'
    }))
    res.json({ analysis: results })
  }