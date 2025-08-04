pipeline {
    // Jenkins va maintenant construire l'agent à partir du Dockerfile
    // qui se trouve dans le dossier 'agent' de notre projet.
    agent {
        dockerfile {
            dir 'agent'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Analyse SonarQube (SAST & SCA)') {
            steps {
                script {
                    // L'agent a Docker, donc il peut lancer le conteneur du scanner
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
                    // L'agent a Docker, donc il peut construire l'image
                    def customImage = docker.build(imageName)
                    
                    // On peut maintenant utiliser Trivy de manière fiable
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 1 --severity HIGH,CRITICAL ${imageName}"
                }
            }
        }
    }
}