pipeline {
    agent { label 'docker-agent' }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/varunspark/devhire-portal.git'
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
    }
}