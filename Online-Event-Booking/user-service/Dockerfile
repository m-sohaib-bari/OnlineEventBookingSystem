# Stage 1: Build - Using verified Maven image
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src src
RUN mvn package -DskipTests

# Stage 2: Run - Using verified Temurin image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user (Alpine-style)
RUN adduser -D myuser && \
    chown -R myuser:myuser /app
USER myuser

COPY --from=builder /app/target/demo-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]