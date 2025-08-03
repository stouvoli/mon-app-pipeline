pipeline {
    agent any

    tools {
        // La section tools ne contient que NodeJS, car SonarScanner sera appelé
        // directement dans l'étape concernée.
        nodejs 'NodeJS-18'
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
                // On utilise un bloc 'script' pour la logique plus complexe
                script {
                    // "SonarQube" est le nom du serveur configuré dans Jenkins
                    withSonarQubeEnv('SonarQube') {
                        // On demande à Jenkins de nous donner le chemin de l'outil
                        // nommé 'SonarScanner' dans la configuration globale
                        def scannerHome = tool 'SonarScanner'
                        // On exécute le scanner en utilisant son chemin complet
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