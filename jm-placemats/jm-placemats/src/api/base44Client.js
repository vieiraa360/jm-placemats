// Mock base44 client - all base44 dependencies removed
export const base44 = {
  entities: {
    Product: {
      list: async () => {
        // Mock products data with local images
        return [
          {
            id: "1",
            name: "Red Border Placemat",
            price: 24.99,
            image_url: "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg",
            category: "placemat",
            featured: true,
            description: "Classic white placemat with red beaded border",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "2",
            name: "Pink & White Coasters Set",
            price: 12.99,
            image_url: "/img/white-pink-5.jpeg",
            category: "coaster",
            featured: true,
            description: "Set of 5 pink and white beaded coasters",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "3",
            name: "Complete Dining Set",
            price: 89.99,
            image_url: "/img/WhatsApp-Image-2021-06-09-at-12.38.43.jpeg",
            category: "set",
            featured: true,
            description: "Full set of placemats and coasters",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "4",
            name: "White & Pink Border Placemat",
            price: 19.99,
            image_url: "/img/white-pink-3.jpeg",
            category: "placemat",
            featured: false,
            description: "Delicate pink border for feminine elegance",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "5",
            name: "Green Stripes Placemat",
            price: 22.99,
            image_url: "/img/green-stripes-3.jpeg",
            category: "placemat",
            featured: false,
            description: "Fresh green stripes for a natural dining experience",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "6",
            name: "Blue Stripes Placemat",
            price: 22.99,
            image_url: "/img/blue-stripes-3.jpeg",
            category: "placemat",
            featured: false,
            description: "Classic blue stripes adding a touch of elegance",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "7",
            name: "Peach & White Placemat",
            price: 21.99,
            image_url: "/img/peach-white-3.jpeg",
            category: "placemat",
            featured: false,
            description: "Soft peach border design for elegant dining",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "8",
            name: "Black Draughts Placemat",
            price: 23.99,
            image_url: "/img/Black-draughts-3.jpeg",
            category: "placemat",
            featured: false,
            description: "Elegant black and white pattern on a modern dining table",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "9",
            name: "Green Stripes Coasters",
            price: 14.99,
            image_url: "/img/green-stripes-5.jpeg",
            category: "coaster",
            featured: false,
            description: "Fresh green and white striped coaster set",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "10",
            name: "Peach & White Coaster",
            price: 11.99,
            image_url: "/img/peach-white-2.jpeg",
            category: "coaster",
            featured: false,
            description: "Elegant peach beaded coaster with border design",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "11",
            name: "Pink Border Coaster",
            price: 10.99,
            image_url: "/img/white-pink-2.jpeg",
            category: "coaster",
            featured: false,
            description: "White and pink beaded coaster",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "12",
            name: "Blue Stripes Complete Set",
            price: 79.99,
            image_url: "/img/blue-stripes-6.jpeg",
            category: "set",
            featured: false,
            description: "Blue and white striped placemat and coaster set",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "13",
            name: "Ivory Square Complete Set",
            price: 84.99,
            image_url: "/img/coasters-and-placemats-ivory-square.jpeg",
            category: "set",
            featured: false,
            description: "Black and ivory beaded placemat with matching coasters",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "14",
            name: "Peach & White Complete Set",
            price: 74.99,
            image_url: "/img/peach-white-6.jpeg",
            category: "set",
            featured: false,
            description: "Matching peach and white placemat with coaster",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "15",
            name: "Red Border Complete Set",
            price: 82.99,
            image_url: "/img/WhatsApp-Image-2021-10-14-at-01.48.16.jpeg",
            category: "set",
            featured: false,
            description: "White and red beaded placemat with matching coaster",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "16",
            name: "France Flag Placemat",
            price: 25.99,
            image_url: "/img/france-flag-3.jpeg",
            category: "placemat",
            featured: false,
            description: "Patriotic French tricolor design",
            material: "Handcrafted Beads",
            in_stock: true
          },
          {
            id: "17",
            name: "Red Stars Placemat",
            price: 24.99,
            image_url: "/img/red-stars-3.jpeg",
            category: "placemat",
            featured: false,
            description: "Festive red stars pattern for special occasions",
            material: "Handcrafted Beads",
            in_stock: true
          }
        ];
      }
    },
    Order: {
      create: async (orderData) => {
        // Mock order creation - simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...orderData,
          created_at: new Date().toISOString()
        };
      }
    },
    ContactInquiry: {
      create: async (data) => {
        // Send to backend API
        try {
          const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit contact inquiry');
          }

          const result = await response.json();
          return {
            id: result.data.id,
            ...data,
            created_at: result.data.createdAt
          };
        } catch (error) {
          console.error('Error submitting contact inquiry:', error);
          // Fallback to mock if backend is not available
          console.warn('Backend unavailable, using mock response');
          await new Promise(resolve => setTimeout(resolve, 500));
          return {
            id: `inquiry_${Date.now()}`,
            ...data,
            created_at: new Date().toISOString()
          };
        }
      }
    },
    Testimonial: {
      filter: async (filters, sort) => {
        // Mock testimonials data
        return [
          {
            id: "1",
            client_name: "Sarah Johnson",
            testimonial: "Absolutely love my new placemats! The quality is exceptional and they look beautiful on my table.",
            rating: 5,
            published: true,
            image_url: "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg"
          },
          {
            id: "2",
            client_name: "Michael Chen",
            testimonial: "Great craftsmanship and fast shipping. Highly recommend!",
            rating: 5,
            published: true,
            image_url: null
          },
          {
            id: "3",
            client_name: "Emma Williams",
            testimonial: "These placemats have transformed my dining room. Beautiful and durable!",
            rating: 5,
            published: true,
            image_url: "/img/white-pink-3.jpeg"
          }
        ];
      }
    },
    BlogPost: {
      list: async () => [],
      filter: async () => []
    }
  },
  integrations: {
    Core: {
      GenerateImage: async ({ prompt }) => {
        // Mock image generation - returns a placeholder
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          url: `https://via.placeholder.com/800x600/9CAF88/FFFFFF?text=${encodeURIComponent(prompt.substring(0, 30))}`
        };
      },
      InvokeLLM: async () => {
        throw new Error("InvokeLLM not implemented in mock");
      },
      SendEmail: async () => {
        throw new Error("SendEmail not implemented in mock");
      },
      UploadFile: async () => {
        throw new Error("UploadFile not implemented in mock");
      },
      ExtractDataFromUploadedFile: async () => {
        throw new Error("ExtractDataFromUploadedFile not implemented in mock");
      },
      CreateFileSignedUrl: async () => {
        throw new Error("CreateFileSignedUrl not implemented in mock");
      },
      UploadPrivateFile: async () => {
        throw new Error("UploadPrivateFile not implemented in mock");
      }
    }
  },
  auth: {
    // Mock auth - not implemented
  }
};
