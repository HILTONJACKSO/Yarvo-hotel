import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class FeatureGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true; // All modules are fully accessible for Kwalee Beach Resort
  }
}
