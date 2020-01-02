FROM nginx
# Run 'npm instsall' and 'npm run build' to generate the 'dist' directory, and make a tarball 
ADD dist.tar.gz /tmp
COPY ngradminportal.conf /etc/nginx/conf.d/ngradminportal.conf
EXPOSE 3000
