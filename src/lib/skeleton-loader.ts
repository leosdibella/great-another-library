import { attributeToBoolean, GalMixin, GalObserved } from './utilities';

@GalMixin('skeleton-loader')
export class SkeletonLoader {
  #skeletonLoader_isLoading: boolean = false;

  @GalObserved()
  public set skeletonLoader_isLoading(skeletonLoader_isLoading: boolean) {
    this.#skeletonLoader_isLoading = attributeToBoolean(
      skeletonLoader_isLoading
    );
  }

  public get skeletonLoader_isLoading() {
    return this.#skeletonLoader_isLoading;
  }
}
