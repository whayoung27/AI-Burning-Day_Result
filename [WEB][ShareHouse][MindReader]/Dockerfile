FROM ubuntu:18.04

MAINTAINER AI-BURNING, "minhyeok.lee95@gmail.com"

RUN apt-get update -y
RUN apt-get install -y build-essential
RUN apt-get install -y python python3 python3-dev python3-pip
RUN pip3 install --upgrade pip

ENV LANG C.UTF-8

COPY server/requirements.txt /tmp/requirements.txt

# Python requirements
RUN pip3 install -r /tmp/requirements.txt


RUN apt-get install -y git vim
RUN pip3 install git+https://github.com/kmkurn/pytorch-crf#egg=pytorch_crf
RUN pip3 install konlpy

RUN apt install -y default-jre
RUN apt install -y openjdk-11-jre-headless
RUN apt install -y openjdk-8-jre-headless
RUN apt install -y default-jre
RUN apt install -y default-jdk

RUN pip3 install nltk
RUN python3 -c 'import nltk; nltk.download("punkt")'



ENV BASEDIR /app
# END
RUN rm -rf /tmp
ENTRYPOINT ["python3"]
CMD ["/app/main.py"]

