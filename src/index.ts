import 'reflect-metadata';
import { Container } from 'typedi';
import { AffirmAprCalculatorController, AffirmCalculatorControllerOptions } from './controller';

export function Initialize(options: AffirmCalculatorControllerOptions) {
  document.addEventListener('DOMContentLoaded', () => {
    const controller = Container.get(AffirmAprCalculatorController);
    controller.initialize(options);
  });
}
