import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Upload, Package } from 'lucide-react';
import type { Product } from '@/types';
import { brands, categories } from '@/data/mockData';

interface ProductFormProps {
  products: Product[];
  onSave: (product: Product | Omit<Product, 'id' | 'sku'>) => void;
}

export function ProductForm({ products, onSave }: ProductFormProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    brand: string;
    status: 'Active' | 'Draft' | 'OOS';
    images: string[];
  }>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
    status: 'Active',
    images: []
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          stock: product.stock.toString(),
          brand: product.brand,
          status: product.status,
          images: product.images
        });
        setPreviewImages(product.images);
      }
    }
  }, [isEdit, id, products]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreviewImages(prev => [...prev, result]);
          setFormData(prev => ({ ...prev, images: [...prev.images, result] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      brand: formData.brand,
      status: formData.status,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200']
    };

    if (isEdit && id) {
      onSave({ ...productData, id, sku: products.find(p => p.id === id)?.sku || '' });
    } else {
      onSave(productData);
    }
    
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={isEdit ? 'Edit Product' : 'Add New Product'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Products', path: '/products' },
          { label: isEdit ? 'Edit' : 'Add New' }
        ]}
      />

      <div className="p-8">
        <form onSubmit={handleSubmit}>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEdit ? 'Update Product' : 'Save Product'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-500" />
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Oticon Real 1"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description..."
                      className="mt-2 min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">
                        Price <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="stock" className="text-sm font-medium">
                        Stock Quantity <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        placeholder="0"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="brand" className="text-sm font-medium">
                        Brand <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.brand} 
                        onValueChange={(value) => handleInputChange('brand', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map(brand => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleInputChange('category', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-sm font-medium">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: 'Active' | 'Draft' | 'OOS') => 
                          setFormData(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="OOS">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Images */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-red-500" />
                    Product Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-red-300 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-red-500 font-medium">Upload a file</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer transition-colors"
                    >
                      Choose Files
                    </Label>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
