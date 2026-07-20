# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Run stage ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Patch known OS-level vulnerabilities in the base image
RUN apk update && apk upgrade --no-cache

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
