pipeline {
    agent any

    tools {
        // "NodeJS-18" est le nom que vous avez donné à votre
        // installation de NodeJS dans la configuration de Jenkins
        nodejs 'NodeJS-18'
        // "SonarScanner" est le nom de votre installation SonarQube Scanner
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
