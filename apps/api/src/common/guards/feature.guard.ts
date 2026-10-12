import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_KEY } from '../decorators/feature.decorator';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredFeature = this.reflector.getAllAndOverride<string>(FEATURE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredFeature) {
      return true; // Endpoint doesn't require a specific feature
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.features || !user.features.includes(requiredFeature)) {
      throw new ForbiddenException(`Your property does not have access to the ${requiredFeature} module. Please upgrade your subscription.`);
    }
    
    return true;
  }
}
