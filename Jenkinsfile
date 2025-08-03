pipeline {
    agent any

    tools {
        // "NodeJS-18" est le nom de l'outil configuré dans Jenkins
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
                // On réutilise le wrapper standard, maintenant que tout est bien configuré
                // "SonarQube" est le nom du serveur configuré dans Jenkins
                withSonarQubeEnv('SonarQube') {
                    script {
                        // "SonarScanner" est le nom de l'outil configuré dans Jenkins
                        def scannerHome = tool 'SonarScanner'
                        // On exécute le scanner sans arguments supplémentaires,
                        // withSonarQubeEnv se charge de l'authentification
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Vérification du Quality Gate') {
            steps {
                // On augmente le temps d'attente pour la première analyse
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