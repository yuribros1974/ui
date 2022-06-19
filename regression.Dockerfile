FROM centos:7

RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash - && yum install nodejs -y
RUN mkdir -p /mlrun/tests/reports/
COPY $PWD/ /mlrun
WORKDIR /mlrun