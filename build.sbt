organization := "xieyuheng"
name := "cicada"
version := "0.0.1"
scalaVersion := "2.13.1"

scalacOptions ++= Seq(
  "-deprecation",
  "-encoding", "UTF-8",
  "-unchecked",
  "-feature",
  "-language:implicitConversions",
  "-Xfatal-warnings",
)

enablePlugins(JavaAppPackaging)
publishArtifact in packageDoc := false
publishArtifact in packageSrc := false
