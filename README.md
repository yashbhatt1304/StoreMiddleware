Store Middleware Application!

Run the development server --> nodemon express.js

Run the production server --> node express.js

### Configure Prometheus
* Install Prometheus
brew install prometheus
* Configure the URL of Express Application in Prometheus.yml file in the below path.
In local System(mac)  -->  /opt/homebrew/etc/prometheus.yml

### Configure Loki
* Install Loki
brew install loki
* use this querry to check logs 
http://localhost:3100/loki/api/v1/query_range?query={job=%22express-app%22}
