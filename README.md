# Backend - StockWiseCare

## Problem Statement
The backend serves as the data provider for the frontend application. It handles requests and returns portfolio, charity donation, and other analytical data.

## Proposed Solution
A RESTful API built with Express.js that serves data related to the user's investments and analytics. The backend communicates with the database to retrieve and process data.

## Tech Stack
- Node.js
- Express.js
- MongoDB (or other databases)

## Core Features
- **Portfolio Data**: Provides data on the user's portfolio, including value and gains.
- **Charity Donations**: Serves data about the user's charity donations.
- **Market Insights**: Returns AI-based insights and sentiment analysis on stock holdings.

## Additional Features
- Basic authentication to secure routes.
- Error handling for each API request.

## Implementation
- Created Express routes for each data request (`GET` requests).
- Integrated with MongoDB to retrieve and store user-related data.

## Deployment
1. Deploy to a cloud platform such as Render or Heroku.
2. Set up environment variables like database credentials.
3. Deployed link: https://stockwisecare-backend.onrender.com

## Integration with Frontend
The backend API is connected with the frontend via HTTP requests made using Axios. Data is served in JSON format.

## Notes
While the frontend and backend are connected, additional work is required for implementing proper authentication, error handling, and optimization.

## Contact
Linkdin: www.linkedin.com/in/sri-poojitha-jorige-377270294, 
gmail: sripoojitha.2006@gmail.com
