FROM alpine/java:17-jdk

WORKDIR /root

COPY ./target/karting-rm-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "karting-rm-0.0.1-SNAPSHOT.jar"]
