pipeline {
    // Le pipeline s'exécute maintenant dans un conteneur dédié
    agent {
        docker {
            image 'node:18-bullseye'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
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
                // Cette étape ne change pas, car elle s'exécute dans son propre conteneur
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
                    // Cette commande va maintenant fonctionner car l'agent a Docker
                    def customImage = docker.build(imageName)

                    docker.image('aquasec/trivy:latest').inside {
                        sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${imageName}"
                    }
                }
            }
        }
    }
}