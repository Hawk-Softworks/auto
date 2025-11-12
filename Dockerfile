# Use nginx:alpine as base image for small size and security
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Ensure we have the nginx command
RUN nginx -v

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY manifest.json /usr/share/nginx/html/
COPY service-worker.js /usr/share/nginx/html/
COPY icon-192.png /usr/share/nginx/html/
COPY icon-512.png /usr/share/nginx/html/
COPY icon-maskable-512.png /usr/share/nginx/html/
COPY icon.svg /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
