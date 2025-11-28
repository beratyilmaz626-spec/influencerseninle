// This is a demo of a preview
'use client';
import { Component } from "@/components/ui/typewriter-testimonial";

const DemoOne = () => {
  const testimonials = [
    {
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_1.mp3',
      text: 'This product has revolutionized my workflow. The intuitive interface and powerful features make it an indispensable tool for my daily tasks. Highly recommended for anyone looking to boost productivity.',
      name: 'John Doe',
      jobtitle: 'Software Engineer',
    },
    {
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_2.mp3',
      text: 'An exceptional experience from start to finish. The customer support is top-notch, and the product consistently exceeds my expectations. I can confidently say this is the best in its class.',
      name: 'Jane Smith',
      jobtitle: 'Marketing Manager',
    },
    {
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_3.mp3',
      text: 'The design is sleek, and the performance is unparalleled. It truly stands out among competitors. This investment has paid off exponentially in terms of efficiency and results.',
      name: 'Alex Johnson',
      jobtitle: 'UX Designer',
    },
    {
      image: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_4.mp3',
      text: 'I was skeptical at first, but this product delivered beyond my wildest dreams. It is robust, reliable, and has become an essential part of my professional toolkit. Simply amazing!',
      name: 'Emily White',
      jobtitle: 'Project Lead',
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a6dd7228f2d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_5.mp3',
      text: 'This tool is a game-changer for data analysis. The visualisations are clear, and the insights gained are invaluable. It has transformed how we approach our business decisions.',
      name: 'David Lee',
      jobtitle: 'Data Scientist',
    },
    {
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_6.mp3',
      text: 'I appreciate the continuous updates and improvements. The team behind this product clearly listens to user feedback. It keeps getting better with every release. Fantastic!',
      name: 'Sarah Chen',
      jobtitle: 'Operations Manager',
    },
    {
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_7.mp3',
      text: 'The support I received was outstanding. They quickly resolved my issue and went above and beyond. It is comforting to know such dedicated professionals are behind this software.',
      name: 'Michael Brown',
      jobtitle: 'Customer Support Lead',
    },
    {
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      audio: 'audio_8.mp3',
      text: 'This is exactly what I needed! It simplified complex tasks and allowed me to focus on what truly matters. The seamless integration with my existing tools was a huge plus.',
      name: 'Chris Taylor',
      jobtitle: 'Entrepreneur',
    },
  ];

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Component testimonials={testimonials} />
    </div>
  );
};

export default DemoOne;