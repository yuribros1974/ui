FROM centos:7

RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash - && yum install nodejs -y
COPY $PWD/ /mlrun
RUN rm -r /mlrun/tests/reports/
WORKDIR /mlrun