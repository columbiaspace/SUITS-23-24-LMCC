import rasterio

# Define the path to the TIFF file
tiff_path = r'src\assets\Images\rockyard_map_geo.tif'

# Open the TIFF file
with rasterio.open(tiff_path) as src:
    # Get the bounds of the image
    bounds = src.bounds
    print(bounds)

    # If you need to convert pixel coordinates to geographic coordinates
    # Use the `transform` attribute
    transform = src.transform
    print(transform)
