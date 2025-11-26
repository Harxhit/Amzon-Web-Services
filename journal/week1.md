In week 1, I explored Gitpod, understood how it works, and learned how to set up a cloud-based development workspace. I connected my GitHub account to Gitpod and configured basic workspace settings. I also created and verified my AWS account.

At first, I tried running the AWS CLI inside Gitpod, but Gitpod repeatedly required card verification for AWS actions or any actions. Because of that, I decided to install and use the AWS CLI locally instead of inside Gitpod.

I downloaded the AWS CLI for Linux, installed it using the package manager, and verified the installation using aws --version. After that, I ran aws configure to link my local environment with my AWS account. I entered my Access Key ID, Secret Access Key, default region, and output format.

Now the AWS CLI works completely on my local machine without needing Gitpod or card verification. Below is the screenshot showing my AWS CLI installation, setup, and configuration steps.

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

Below is the screen shot of the working

```bash
aws --version
```

![AWS CLI running locally proof](/assets/aws.png)

After installation, I used aws configure to connect my local environment to my AWS account by entering my Access Key ID, Secret Access Key, default region, and output format. The CLI now works fully on my local machine without requiring Gitpod or repeated verification checks. My screenshot confirms the successful installation and configuration.

Alongside this setup, I also completed essential AWS account security steps such as enabling MFA and creating a budget to monitor costs.

Since the next week involves containerization, and I had no prior experience with Docker, I took the time to learn Docker fundamentals. I explored the core concepts—images, containers, Dockerfiles, layers, registries, and container workflows. I documented my learning and experiments in my Docker repository, which shows my progress from basic commands to building simple custom images. This preparation ensures that I’ll be ready for containerization tasks in the upcoming week.
