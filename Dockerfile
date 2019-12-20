FROM nginx
ADD ngrAdminPortal.tar.gz /tmp
COPY ngradminportal.conf /etc/nginx/conf.d/ngradminportal.conf
EXPOSE 3000
