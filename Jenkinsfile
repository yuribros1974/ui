@Library('pipelinex@development') _
import com.iguazio.pipelinex.DockerRepo

workDir = '/home/jenkins'
podLabel = 'mlrun-ui-release'
gitProject = 'ui'
gitProjectUser = 'mlrun'
dockerTag = env.TAG_NAME.replaceFirst(/^v/, '')

podTemplate(
    label: podLabel,
    containers: [
        containerTemplate(name: 'jnlp-docker-nodejs', image: 'jnlp-docker-nodejs', workingDir: workDir, resourceRequestCpu: '2000m', resourceLimitCpu: '2000m', resourceRequestMemory: '2048Mi', resourceLimitMemory: '2048Mi'),
        containerTemplate(name: 'mlrun-ui-pr-tests-runner', image: 'mlrun-ui-pr-tests-runner:0.0.1', workingDir: workDir, ttyEnabled: true, command: 'cat'),
    ],
    volumes: [
        hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
    ],
) {
    node(podLabel) {
        common.notify_slack {
            container('mlrun-ui-pr-tests-runner') {

                stage("git clone") {
                    checkout scm
                }

                common.reportStage('Build mlrun/ui') {
                    println(common.shellc("MLRUN_DOCKER_TAG=${dockerTag} npm run docker"))
                    dockerx.images_push_multi_registries(
                                ["${gitProjectUser}/mlrun-ui:${dockerTag}"],
                                [
                                    DockerRepo.ARTIFACTORY_IGUAZIO,
                                    DockerRepo.MLRUN_DOCKER_HUB,
                                    DockerRepo.MLRUN_QUAY_IO
                                ]
                    )
                }
                
                common.reportStage('update release status') {
                    withCredentials([
                        string(credentialsId: "iguazio-prod-git-user-token", variable: 'GIT_TOKEN')
                    ]) {
                        container('mlrun-ui-pr-tests-runner') {
                            github.update_release_status(gitProject, gitProjectUser, env.TAG_NAME, GIT_TOKEN)
                        }
                    }
                }
            }
        }
    }
}
