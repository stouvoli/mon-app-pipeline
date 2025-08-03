pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18' // Nom de l'outil configuré dans Jenkins
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
                    // "SonarQube" est le nom du serveur configuré dans Jenkins
                    withSonarQubeEnv('SonarQube') {
                        // "SonarScanner" est le nom de l'outil configuré dans Jenkins
                        def scannerHome = tool 'SonarScanner'
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Vérification du Quality Gate') {
            steps {
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
                    sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${imageName}"
                }
            }
        }
    }
}