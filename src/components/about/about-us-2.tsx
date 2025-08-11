"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Settings,
  Type,
  Users,
  Plus,
  Trash2,
  Linkedin,
  Twitter,
  Dribbble,
  GripVertical,
  Upload,
} from "lucide-react";

export interface TeamMemberSocialLink {
  id: string;
  platform: "linkedin" | "twitter" | "dribbble";
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  socialLinks: TeamMemberSocialLink[];
}

export interface AboutUs2Data {
  title: string;
  description: string;
  teamMembers: TeamMember[];
}

interface AboutUs2Props {
  data: AboutUs2Data;
  isEditable?: boolean;
  onUpdate?: (
    componentId: string,
    newData: { aboutUs2Data: AboutUs2Data }
  ) => void;
  componentId?: string;
}

export const defaultAboutUs2Data: AboutUs2Data = {
  title: "Meet Our Creative Team",
  description:
    "The passionate people behind our success. We are a group of designers, developers, and strategists dedicated to excellence.",
  teamMembers: [
    {
      id: "1",
      name: "Jane Doe",
      role: "Lead Designer",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
      bio: "A creative mind with a passion for beautiful and functional design.",
      socialLinks: [{ id: "1", platform: "linkedin", url: "#" }],
    },
    {
      id: "2",
      name: "John Smith",
      role: "Lead Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400",
      bio: "Expert in turning complex problems into elegant software solutions.",
      socialLinks: [{ id: "1", platform: "twitter", url: "#" }],
    },
    {
      id: "3",
      name: "Emily White",
      role: "Project Manager",
      imageUrl:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400",
      bio: "Ensuring projects are delivered on time and exceed expectations.",
      socialLinks: [{ id: "1", platform: "dribbble", url: "#" }],
    },
  ],
};

const convertUnsplashUrl = (
  url: string,
  width: number = 400,
  quality: number = 80
): string => {
  if (!url) return "";

  const unsplashPhotoMatch = url.match(
    /unsplash\.com\/photos\/.*?-([a-zA-Z0-9_-]{11})/
  );

  if (unsplashPhotoMatch) {
    const photoId = unsplashPhotoMatch[1];
    return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=${quality}`;
  }

  return url;
};

export function AboutUs2({
  data = defaultAboutUs2Data,
  isEditable = false,
  onUpdate,
  componentId,
}: AboutUs2Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [memberImagePreviews, setMemberImagePreviews] = useState<{
    [key: string]: string;
  }>({});

  const handleUpdate = (updates: Partial<AboutUs2Data>) => {
    onUpdate?.(componentId!, { aboutUs2Data: { ...data, ...updates } });
  };

  const handleMemberUpdate = (id: string, updates: Partial<TeamMember>) => {
    handleUpdate({
      teamMembers: data.teamMembers.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  };

  const addMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "New Member",
      role: "Role",
      imageUrl: "https://via.placeholder.com/400",
      bio: "",
      socialLinks: [],
    };
    handleUpdate({ teamMembers: [...data.teamMembers, newMember] });
  };

  const removeMember = (id: string) => {
    handleUpdate({ teamMembers: data.teamMembers.filter((m) => m.id !== id) });
    // Also remove the preview
    const newPreviews = { ...memberImagePreviews };
    delete newPreviews[id];
    setMemberImagePreviews(newPreviews);
  };

  // Member image upload handler
  const handleMemberImageUpload = (
    memberId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMemberImagePreviews((prev) => ({ ...prev, [memberId]: result }));
        handleMemberUpdate(memberId, { imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getMemberImageUrl = (memberId: string, originalUrl: string) => {
    return memberImagePreviews[memberId] || convertUnsplashUrl(originalUrl);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "dribbble":
        return <Dribbble className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderPreview = () => (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {data.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.teamMembers.map((member) => (
            <Card
              key={member.id}
              className="text-center overflow-hidden transition-shadow hover:shadow-xl"
            >
              <img
                src={getMemberImageUrl(member.id, member.imageUrl)}
                alt={member.name}
                className="w-full h-64 object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400";
                }}
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {member.bio}
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  {member.socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  if (!isEditable) return renderPreview();

  return (
    <Card className="relative">
      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <div className="absolute top-4 right-4 z-20">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </CollapsibleTrigger>
        </div>
        {renderPreview()}
        <CollapsibleContent>
          <CardContent className="p-6 border-t bg-muted/30">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Type className="h-4 w-4" />
                  Section Header
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={data.title}
                      onChange={(e) => handleUpdate({ title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={data.description}
                      onChange={(e) =>
                        handleUpdate({ description: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4" />
                  Team Members
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                  {data.teamMembers.map((member, index) => (
                    <Card key={member.id} className="p-4 bg-background">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />{" "}
                          Member #{index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={member.name}
                            onChange={(e) =>
                              handleMemberUpdate(member.id, {
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            value={member.role}
                            onChange={(e) =>
                              handleMemberUpdate(member.id, {
                                role: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-span-full">
                          <Label>Upload Member Image</Label>
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleMemberImageUpload(member.id, e)
                              }
                              className="hidden"
                              id={`memberImageUpload-${member.id}`}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById(
                                    `memberImageUpload-${member.id}`
                                  )
                                  ?.click()
                              }
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <Label>Image URL</Label>
                          <Input
                            value={member.imageUrl}
                            onChange={(e) =>
                              handleMemberUpdate(member.id, {
                                imageUrl: e.target.value,
                              })
                            }
                            placeholder="Enter image URL or upload image above"
                          />
                        </div>
                        {(memberImagePreviews[member.id] ||
                          member.imageUrl) && (
                          <div className="col-span-full">
                            <Label>Current Image Preview</Label>
                            <img
                              src={getMemberImageUrl(
                                member.id,
                                member.imageUrl
                              )}
                              alt={`${member.name} preview`}
                              className="max-w-24 h-24 object-cover rounded border mt-2"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/400";
                              }}
                            />
                          </div>
                        )}
                        <div className="col-span-full">
                          <Label>Bio</Label>
                          <Textarea
                            value={member.bio}
                            onChange={(e) =>
                              handleMemberUpdate(member.id, {
                                bio: e.target.value,
                              })
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMember}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
