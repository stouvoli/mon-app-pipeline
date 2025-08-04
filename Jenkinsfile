pipeline {
    agent {
        // Le pipeline s'exécute maintenant dans un conteneur agent dédié
        docker {
            image 'node:18-bullseye'
            // L'agent hérite de l'accès au socket Docker du contrôleur Jenkins
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
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
                // On utilise la méthode "side-car" pour lancer le scanner SonarQube
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
                    // Cette commande fonctionne car l'agent Docker a accès à Docker
                    def customImage = docker.build(imageName)

                    // On utilise la méthode "side-car" pour le scan Trivy
                    docker.image('aquasec/trivy:latest').inside {
                        sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${imageName}"
                    }
                }
            }
        }
    }
}