/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'utfs.io',
			port: '',
		  },
		  {
			protocol: 'https',
			hostname: 'picsum.photos',
			port: '',
		  },
		],
	  },
};

export default nextConfig;
