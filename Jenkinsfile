pipeline {
    agent any

    environment {
        // 'sonarqube-token' est l'ID du secret que nous allons créer dans Jenkins
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    stages {
        stage('Build') {
            steps {
                echo '--- ETAPE DE BUILD ---'
                sh 'npm install'
            }
        }
        stage('Analyse SonarQube (SAST & SCA)') {
            steps {
                // On utilise l'image Docker officielle de SonarScanner
                script {
                    docker.image('sonarsource/sonar-scanner-cli').inside {
                        sh """
                           sonar-scanner \
                           -Dsonar.host.url=http://sonarqube:9000 \
                           -Dsonar.token=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }
        stage('Vérification du Quality Gate') {
            steps {
                timeout(time: 15, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Build & Scan Image Docker') {
            steps {
                script {
                    def imageName = "votre-user/mon-app-node:${env.BUILD_NUMBER}"
                    sh "docker build -t ${imageName} ."
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${imageName}"
                }
            }
        }
    }
}