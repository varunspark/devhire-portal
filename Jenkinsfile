pipeline {
    agent { label 'docker-agent' }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/varunspark/devhire-portal.git'
            }
        }

        stage('Set Version') {
            steps {
                dir('backend') {
                    sh "mvn versions:set -DnewVersion=1.0.${BUILD_NUMBER} -DgenerateBackupPoms=false"
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Verify Artifacts') {
            steps {
                sh 'ls -lh backend/target/*.jar'
                sh 'ls -lh frontend/dist'
            }
        }

        stage('Deploy to Nexus') {
            steps {
                dir('backend') {
                    withCredentials([
                        usernamePassword(credentialsId: 'nexus-releases', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')
                    ]) {
                        writeFile file: 'nexus-settings.xml', text: """
                        <settings>
                          <servers>
                            <server>
                              <id>nexus-releases</id>
                              <username>${NEXUS_USER}</username>
                              <password>${NEXUS_PASS}</password>
                            </server>
                            <server>
                              <id>nexus-snapshots</id>
                              <username>${NEXUS_USER}</username>
                              <password>${NEXUS_PASS}</password>
                            </server>
                          </servers>
                        </settings>
                        """
                        sh 'mvn deploy -DskipTests -s nexus-settings.xml'
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')
                ]) {
                    sh """
                        docker build -t ${DOCKERHUB_USER}/devhire-backend:${BUILD_NUMBER} -t ${DOCKERHUB_USER}/devhire-backend:latest ./backend
                        docker build -t ${DOCKERHUB_USER}/devhire-frontend:${BUILD_NUMBER} -t ${DOCKERHUB_USER}/devhire-frontend:latest ./frontend
                    """
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')
                ]) {
                    sh """
                        echo "\$DOCKERHUB_PASS" | docker login -u "\$DOCKERHUB_USER" --password-stdin
                        docker push ${DOCKERHUB_USER}/devhire-backend:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_USER}/devhire-backend:latest
                        docker push ${DOCKERHUB_USER}/devhire-frontend:${BUILD_NUMBER}
                        docker push ${DOCKERHUB_USER}/devhire-frontend:latest
                        docker logout
                    """
                }
            }
        }
    }
}