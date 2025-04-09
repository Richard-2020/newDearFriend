# AWS Deployment Guide for DearFriend

This guide will help you deploy the DearFriend application to AWS using Elastic Beanstalk for the backend and S3 + CloudFront for the frontend.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Node.js and npm installed
4. Git installed

## Backend Deployment (Elastic Beanstalk)

1. Install the Elastic Beanstalk CLI:
```bash
pip install awsebcli
```

2. Navigate to the server directory:
```bash
cd server
```

3. Initialize Elastic Beanstalk:
```bash
eb init -p node.js dearfriend-backend
```

4. Create an environment and deploy:
```bash
eb create dearfriend-env
```

5. Configure environment variables in the AWS Console:
   - MONGODB_URI: Your MongoDB connection string
   - PORT: 5000

## Frontend Deployment (S3 + CloudFront)

1. Build the React application:
```bash
cd client
npm install
npm run build
```

2. Create an S3 bucket:
   - Go to AWS S3 Console
   - Create a new bucket with a unique name
   - Enable static website hosting
   - Set bucket policy for public access

3. Upload the build files:
```bash
aws s3 sync build/ s3://your-bucket-name
```

4. Create a CloudFront distribution:
   - Go to AWS CloudFront Console
   - Create a new distribution
   - Set the S3 bucket as the origin
   - Configure caching and security settings

## Domain Setup

1. Register a domain in Route 53 or use an existing one
2. Create a hosted zone for your domain
3. Add A records pointing to your CloudFront distribution
4. Configure SSL certificate in CloudFront

## Environment Configuration

1. Update the frontend API endpoint:
   - Edit `client/src/components/QuestionBoard.tsx`
   - Change `http://localhost:5000` to your Elastic Beanstalk URL

2. Update CORS settings in the backend:
   - Edit `server/index.js`
   - Update the CORS origin to include your frontend domain

## Monitoring and Maintenance

1. Set up CloudWatch alarms for monitoring
2. Configure auto-scaling for the backend
3. Set up backup strategies for the database
4. Implement logging and error tracking

## Security Considerations

1. Enable HTTPS for all endpoints
2. Implement proper CORS policies
3. Set up proper IAM roles and permissions
4. Configure security groups for the backend
5. Enable AWS WAF for additional protection

## Cost Optimization

1. Use AWS Free Tier where possible
2. Implement auto-scaling to optimize resource usage
3. Use CloudFront caching to reduce backend load
4. Monitor and optimize database queries
5. Consider using AWS Lambda for certain operations

## Troubleshooting

1. Check CloudWatch logs for errors
2. Verify security group settings
3. Check CORS configuration
4. Verify environment variables
5. Monitor database connections

## Additional Resources

- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html)
- [AWS S3 Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [AWS Route 53 Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html) 