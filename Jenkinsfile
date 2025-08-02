pipeline {
    agent any

    tools {
        // Nom défini dans la Global Tool Configuration de Jenkins
        sonarqube 'SonarScanner'
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
                // 'SonarQube' est le nom du serveur configuré dans Jenkins
                withSonarQubeEnv('SonarQube') { 
                    sh 'sonar-scanner' 
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
