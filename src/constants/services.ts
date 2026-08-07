import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'web-development',
    icon: 'Globe',
    illustration: '/illustrations/web-development.svg',
    title: 'Web Application Development',
    description:
      'Web apps and platforms that stay quick as the data grows and the user count climbs.',
  },
  {
    id: 'mobile-development',
    icon: 'Smartphone',
    illustration: '/illustrations/mobile-development.svg',
    title: 'Mobile Application Development',
    description:
      'iOS and Android apps, native or cross-platform, built to the standard people expect from an app they paid for.',
  },
  {
    id: 'custom-software',
    icon: 'Code',
    illustration: '/illustrations/custom-software.svg',
    title: 'Custom Software & Platforms',
    description:
      'Software written for the way your business actually runs, rather than the way a generic tool assumes it does.',
  },
  {
    id: 'system-architecture',
    icon: 'Network',
    illustration: '/illustrations/system-architecture.svg',
    title: 'System Architecture & Consulting',
    description:
      'Help with the decisions that are expensive to reverse later: architecture, infrastructure, and what to build in-house.',
  },
  {
    id: 'ai-automation',
    icon: 'Brain',
    illustration: '/illustrations/ai-automation.svg',
    title: 'Artificial Intelligence & Automation',
    description:
      'AI put to work on a specific job, not bolted on for the sake of it. We build the ones that earn their keep.',
  },
  {
    id: 'blockchain',
    icon: 'Blocks',
    illustration: '/illustrations/blockchain.svg',
    title: 'Blockchain & Distributed Systems',
    description:
      'Smart contracts and decentralised apps, written carefully, because on-chain mistakes are permanent.',
  },
];
