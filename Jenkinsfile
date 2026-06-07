pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "my-backend"
        DOCKER_IMAGE_FRONTEND = "my-frontend"
        SONAR_HOST_URL = "http://13.234.226.173:9000"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Static Code Analysis') {
            steps {
                script {
                    // Using Docker to run Sonar Scanner
                    withSonarQubeEnv('SonarQube') {
                        sh "docker run --rm \
                            -e SONAR_HOST_URL=${SONAR_HOST_URL} \
                            -e SONAR_SCANNER_OPTS=\"-Dsonar.projectKey=3-tier-app\" \
                            -e SONAR_TOKEN=${SONAR_AUTH_TOKEN} \
                            -v \"\$(pwd):/usr/src\" \
                            sonarsource/sonar-scanner-cli"
                    }
                    // This is the missing piece that creates the link in the sidebar
                    timeout(time: 1, unit: 'HOURS') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker-compose build"
            }
        }

        stage('Deploy') {
            steps {
                sh "docker-compose up -d"
            }
        }
    }
}
