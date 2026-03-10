FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline
ARG CACHEBUST=1
COPY src ./src
RUN ./mvnw package -DskipTests
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar target/*.jar"]