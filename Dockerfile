

# Specifies where to get the base image (Node v12 in our case) and creates a new container for it
FROM node:12.18.1

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR ./root

# Install dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy source files from host computer to the container
COPY . .

# Specify port app runs on
EXPOSE 3000

# Run the app
# CMD ["./cloud_sql_proxy", "-instances=givees-295311:asia-south1:givees-dev-db1=tcp:3306", "-credential_file=./credentials.json", "&", "&&", "sleep","10", "&&", "npm", "start"]
CMD ["npm", "start"]




