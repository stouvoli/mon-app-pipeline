pipeline {
    agent any

    tools {
        // "NodeJS-18" est le nom de l'outil configuré dans Jenkins
        nodejs 'NodeJS-18'
    }

    environment {
        // On charge notre secret 'sonarqube-token' dans une variable d'environnement
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
                    // On récupère le chemin de l'outil SonarScanner
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
                // Cette étape va maintenant fonctionner car l'analyse précédente aura réussi
                timeout(time: 5, unit: 'MINUTES') {
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