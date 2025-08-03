pipeline {
    agent any

    tools {
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
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        sh "${scannerHome}/bin/sonar-scanner"
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
                    // On définit le nom de l'image
                    def imageName = "votre-user/mon-app-node:${env.BUILD_NUMBER}"
                    
                    // On utilise la fonction native de Jenkins pour construire l'image
                    def customImage = docker.build(imageName)

                    // On utilise la méthode "side-car" pour lancer le scan Trivy
                    docker.image('aquasec/trivy:latest').inside {
                        sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${imageName}"
                    }
                }
            }
        }
    }
}