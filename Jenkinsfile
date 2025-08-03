pipeline {
    agent any

    tools {
        // "NodeJS-18" est le nom de l'outil configuré dans Jenkins
        nodejs 'NodeJS-18'
    }

    environment {
        // 'sonarqube-token' est l'ID du secret que nous avons créé dans Jenkins
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
                script {
                    // "SonarScanner" est le nom de l'outil configuré dans Jenkins
                    def scannerHome = tool 'SonarScanner'
                    // On exécute le scanner en lui passant explicitement le jeton et l'URL
                    sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.host.url=http://sonarqube:9000 \
                        -Dsonar.token=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Vérification du Quality Gate') {
            steps {
                // Fait échouer le pipeline si le Quality Gate de SonarQube n'est pas "PASS"
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Scan Image Docker') {
            steps {
                script {
                    def imageName = "votre-user/mon-app-node:${env.BUILD_NUMBER}"
                    echo "--- BUILD DE L'IMAGE DOCKER : ${imageName} ---"
                    sh "docker build -t ${imageName} ."

                    echo "--- SCAN DE L'IMAGE DOCKER ---"
                    // Fait échouer le build si des vulnérabilités critiques sont trouvées
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${imageName}"
                }
            }
        }
    }
}